import { useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text as RNText } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { z } from 'zod';

import defaultUserPhotoImg from '@/assets/userPhotoDefault.png';

import { ScreenHeader } from '@/components/ScreenHeader';
import { UserPhoto } from '@/components/UserPhoto';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { AppError } from '@/utils/AppError';

const PHOTO_SIZE = 132;

type FormDataProps = {
  name: string;
  password: string | null;
  confirm_password: string | null;
  email?: string;
  old_password?: string;
};

const profileSchema = z
  .object({
    name: z.string().nonempty('Informe o nome.'),
    email: z.email().optional(),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 dígitos.')
      .nullable()
      .transform((value) => (value ? value : null)),
    old_password: z.string().optional(),
    confirm_password: z
      .string()
      .nullable()
      .transform((value) => (value ? value : null)),
  })
  .superRefine((data, ctx) => {
    const { password, confirm_password } = data;

    if (password) {
      if (!confirm_password) {
        ctx.addIssue({
          path: ['confirm_password'],
          code: "custom",
          message: 'Informe a confirmação.',
        });
      } else if (confirm_password !== password) {
        ctx.addIssue({
          path: ['confirm_password'],
          code: "custom",
          message: 'A confirmação de senha não confere.',
        });
      }
    }
  });

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const { user, updateUserProfile } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: { name: user.name, email: user.email },
    resolver: zodResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          alert('Essa imagem é muito grande. Escolha uma de até 5MB.');
          return;
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const formData = new FormData();
        formData.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch('/users/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const userUpdated = { ...user, avatar: avatarUpdatedResponse.data.avatar };
        updateUserProfile(userUpdated);

        alert('Foto atualizada!');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = { ...user, name: data.name };
      await api.put('/users', data);
      await updateUserProfile(userUpdated);

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar o perfil. Tente novamente mais tarde.';
      alert(title);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-700">
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <View className="items-center mt-6 px-10 gap-1">
          {photoIsLoading ? (
            <View className="w-[132px] h-[132px] rounded-full bg-gray-500 animate-pulse" />
          ) : (
            <UserPhoto
              source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg}
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <RNText className="text-green-500 font-bold text-base mt-2 mb-8">
              Alterar foto
            </RNText>
          </TouchableOpacity>
        </View>

        <View className="px-10">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input placeholder="Nome" value={value} onChangeText={onChange} errorMessage={errors.name?.message} />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => <Input placeholder="E-mail" value={value} onChangeText={() => {}} isDisable />}
          />
        </View>

        <View className="px-10 mt-12 mb-9">
          <RNText className="text-gray-200 font-bold text-md mb-2">Alterar senha</RNText>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => <Input placeholder="Senha antiga" secureTextEntry onChangeText={onChange} />}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => <Input placeholder="Nova senha" secureTextEntry onChangeText={onChange} errorMessage={errors.password?.message} />}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input placeholder="Confirme nova senha" secureTextEntry onChangeText={onChange} errorMessage={errors.confirm_password?.message} />
            )}
          />

          <View className="mt-5">
            <Button title="Atualizar" onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}