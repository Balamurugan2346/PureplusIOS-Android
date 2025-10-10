import { Image } from 'react-native';

export default function CustomImage({ source, style }) {

  const uri = source?.uri;
  return (
    <Image
      style={style}
      source={ {uri:source}}
       contentFit="cover"
       placeholder={require('../../assets/images/placeholder.png')}
       placeholderContentFit="fill"
       transition={500}
    />
  );
}
