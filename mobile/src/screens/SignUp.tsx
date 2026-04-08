import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import LogoSvg from '@/assets/logo.svg';
import BackgroundImg from '@/assets/background.png';
import { AppError } from '@/utils/AppError';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = z
  .object({
    name: z.string().nonempty('Informe o nome.'),
    email: z.email('E-mail inválido').nonempty('Informe o e-mail.'),
    password: z.string().nonempty('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: z.string().nonempty('Confirme a senha.'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirm) {
      ctx.addIssue({
        path: ['password_confirm'],
        code: 'custom',
        message: 'A confirmação da senha não confere.',
      });
    }
  });

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: zodResolver(signUpSchema)
    });
    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await api.post('/users', { name, email, password });
            await signIn(email, password);
        } catch (error) {
            setIsLoading(false);
            const title = error instanceof AppError
                ? error.message
                : 'Não foi possível criar a conta. Tente novamente mais tarde.';
            alert(title);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex flex-1 justify-between px-10 pb-16 relative bg-gray-700">
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
                    <Text className="text-gray-100 text-xl font-bold mb-6 text-center">
                        Crie sua conta
                    </Text>

                    <Controller 
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="email"
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

                    <Controller 
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="Confirme a senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyType="send"
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />         

                    <Button
                        title="Criar e acessar"
                        onPress={handleSubmit(handleSignUp)}
                        isLoading={isLoading}
                    />
                </View>

                <View className="mt-16">
                    <Button 
                        title="Volte para o login" 
                        variant="outline"
                        onPress={handleGoBack}
                    />
                </View>
            </View>
        </ScrollView>
    );
}