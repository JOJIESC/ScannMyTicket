import Image from "next/image"
import {FC} from "react"

export interface AvatarProps {
    width: number;
    avatarOption: string;
}

// AVATARES DISPONIBLES:
// "Black.png",
// "Dark.jpg",
// "DeepPurple.jpg",
// "Gas.png",
// "Japan.png",
// "ManaPurple.jpg",
// "OceanBlue.jpg",
// "Purple.png",
// "Red.jpg",
// "RiverBlue.jpg",
// "Temple.png",
// "Ventura.jpg",
// "Warm.png"

const Avatar: FC<AvatarProps> = ({ width,avatarOption }) => {

    return (
            <Image className="rounded-full ring-2 ring-gray-300 object-cover" src={`/img/avatars/${avatarOption}`} alt="avatar" width={width} height={width}/>
    )
}

export default Avatar