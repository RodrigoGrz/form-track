import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type Props = {
  title: string;
  variant?: 'solid' | 'outline';
  isLoading?: boolean;
  onPress?: () => void;
};

export function Button({
  title,
  variant = 'solid',
  isLoading = false,
  onPress,
}: Props) {
  const baseStyles = "w-full h-14 rounded-sm items-center justify-center";

  const variants = {
    solid: "bg-green-700 active:bg-green-500",
    outline: "border border-green-500 active:bg-gray-500",
  };

  const textVariants = {
    solid: "text-white",
    outline: "text-green-500",
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]}`}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className={`font-bold text-sm ${textVariants[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}