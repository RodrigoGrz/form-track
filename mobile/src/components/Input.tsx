import { View, TextInput, Text, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  errorMessage?: string | null;
  isDisable?: boolean;
};

export function Input({ errorMessage = null, isDisable = false, ...rest }: Props) {
  const invalid = !!errorMessage && !isDisable;

  return (
    <View className="mb-4">
      <TextInput
        className={`
          h-14 px-4 rounded-md text-base
          bg-gray-600 ${isDisable ? 'bg-gray-600/40 text-gray-300' : 'bg-opacity-100 text-gray-100'}
          ${invalid ? 'border border-red-500' : 'border border-transparent focus:border-green-500'}
        `}
        placeholderTextColor="#7C7C8A"
        editable={!isDisable}
        {...rest}
      />

      {!isDisable && errorMessage && (
        <Text className="text-red-500 mt-1 text-sm">
          {errorMessage}
        </Text>
      )}
    </View>
  );
}