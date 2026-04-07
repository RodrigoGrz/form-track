import { Text, Pressable, PressableProps } from "react-native";

type Props = PressableProps & {
  name: string;
  isActive: boolean;
};

export function Group({ name, isActive, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      className={`mr-3 w-24 h-11 bg-gray-600 rounded-md items-center justify-center ${
        isActive ? "border border-green-500" : ""
      }`}
    >
      <Text
        className={`text-xs font-bold uppercase ${
          isActive ? "text-green-500" : "text-gray-200"
        }`}
      >
        {name}
      </Text>
    </Pressable>
  );
}