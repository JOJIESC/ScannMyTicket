import Image from "next/image"
import {FC} from "react"

export interface AvatarProps {
    width: number;
}


const Avatar: FC<AvatarProps> = ({ width }) => {
    return (
        <div>
            <Image className="rounded-full" src='/img/OceanBlue.jpg' alt="avatar" width={width} height={width}/>
        </div>
    )
}

export default Avatar