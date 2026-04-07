import { Image, ImageProps } from "react-native";

type Props = ImageProps & {
  size: number;
}

export function UserPhoto({ size, style, ...rest }: Props) {
  return (
    <Image 
      style={[{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: '#9CA3AF', // gray-400
      }, style]}
      {...rest}
    />
  );
}