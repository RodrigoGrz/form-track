import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, Image, ScrollView } from 'react-native';

import { AuthNavigatorRoutesProps } from '@/routes/auth.routes';
import { useAuth } from '@/hooks/useAuth';

import LogoSvg from '@/assets/logo.svg';
import BackgroundImg from '@/assets/background.png';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { AppError } from '@/utils/AppError';

type FormData = {
  email: string;
  password: string;
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.';

      setIsLoading(false);

      alert(title);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-1 justify-between px-10 pb-16 bg-gray-700">
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          resizeMode="contain"
          className="absolute"
        />

        <View className="items-center my-24">
          <LogoSvg />

          <Text className="text-gray-100 text-sm mt-2">
            Treine sua mente e o seu corpo
          </Text>
        </View>

        <View className="w-full">
          <Text className="text-gray-100 text-xl mb-6 font-bold text-center">
            Acesse sua conta
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail.' }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha.' }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </View>

        <View className="flex items-center gap-5">
          <Text className="text-gray-100 text-sm">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </View>

      </View>
    </ScrollView>
  );
}