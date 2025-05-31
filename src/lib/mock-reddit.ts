
export interface MockRedditPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string; // ISO string
  url: string;
}

const mockPosts: MockRedditPost[] = [
  {
    id: 'reddit_post_1',
    title: 'Major traffic jam on Shahrah-e-Faisal near Nursery',
    content: 'Stuck in a massive traffic jam on Shahrah-e-Faisal for the past hour. It seems like there might have been an accident up ahead. Avoid this route if possible! Commute times are skyrocketing.',
    author: 'karachi_commuter',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    url: 'https://www.reddit.com/r/karachi/comments/mock1'
  },
  {
    id: 'reddit_post_2',
    title: 'Power outage in Gulshan-e-Iqbal Block 13',
    content: 'Anyone else experiencing a power outage in Gulshan Block 13? It has been out for over 2 hours now. K-Electric helpline is not responding. This is getting frustrating with the heat.',
    author: 'gulshan_resident',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    url: 'https://www.reddit.com/r/karachi/comments/mock2'
  },
  {
    id: 'reddit_post_3',
    title: 'Water pipe burst near Tariq Road - Road flooded',
    content: 'A large water pipe has burst on the main road approaching Tariq Road from Shaheed-e-Millat. The road is completely flooded, and traffic is being diverted. Authorities are on site but it looks like a major repair job.',
    author: 'observer123',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    url: 'https://www.reddit.com/r/karachi/comments/mock3'
  },
  {
    id: 'reddit_post_4',
    title: 'Report of a fire at a warehouse in SITE area',
    content: 'Hearing reports and seeing smoke from the SITE area, looks like a warehouse fire. Multiple fire trucks are heading that way. Hope everyone is safe. The smoke plume is visible from miles away.',
    author: 'concerned_citizen_khi',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    url: 'https://www.reddit.com/r/karachi/comments/mock4'
  },
  {
    id: 'reddit_post_5',
    title: 'Small protest gathering near Press Club',
    content: 'There is a small, peaceful protest gathering happening near the Press Club. Traffic is a bit slow in the surrounding area but still moving. Police are present and monitoring the situation.',
    author: 'reporter_eye',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    url: 'https://www.reddit.com/r/karachi/comments/mock5'
  }
];

export function getMockRedditPosts(): MockRedditPost[] {
  // In a real scenario, this would fetch from an API
  return mockPosts;
}
