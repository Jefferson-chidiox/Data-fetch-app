import axios from 'axios';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
    imageUrl?: string;
}

export const fetchData = async (): Promise<Post[]> => {
    try {
        const postsResponse = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');

        // For each post, assign an image URL from Picsum.photos using the post id as seed
        const postsWithImages = postsResponse.data.map((post) => ({
            ...post,
            imageUrl: `https://picsum.photos/seed/${post.id}/200/200`,
        }));

        return postsWithImages;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
