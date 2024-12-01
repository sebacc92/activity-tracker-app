import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchActivities = async ({ queryKey }: QueryFunctionContext) => {
    console.log('queryKey', queryKey)
    const accessToken = queryKey[1];

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Error fetching activities');
    }

    return response.json();
};
