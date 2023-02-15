import { useRouter } from 'next/router'


export default function Video() {
    const router = useRouter()
    // const id = router.query.video
    
    return (
        <>
            <h1>
                Room Number: {router.query['name']}
            </h1>
        </>
    )
}