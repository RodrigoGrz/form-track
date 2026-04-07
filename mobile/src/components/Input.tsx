import { View, TextInput, Text, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, ...rest }: Props) {
  const invalid = !!errorMessage;

  return (
    <View className="mb-4">
      <TextInput
        className={`h-14 px-4 bg-gray-700 text-white text-base rounded-md ${
          invalid ? 'border border-red-500' : 'focus:border-green-500 border border-transparent'
        }`}
        placeholderTextColor="#7C7C8A"
        {...rest}
      />

      {errorMessage && (
        <Text className="text-red-500 mt-1 text-sm">
          {errorMessage}
        </Text>
      )}
    </View>
  );
}