interface ILiveChatProps {
    UserToken: string | null
    LiveToken: string | null
}

interface ICommentProps {
    ownerToken: string
    ownerName: string
    message: string
    isStreamer:boolean
    
}

export type { ILiveChatProps, ICommentProps }
