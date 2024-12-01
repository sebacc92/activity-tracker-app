export const fetchActivities = async ({ queryKey }) => {
    const accessToken = queryKey[1];
    const params = queryKey[2] || {};

    if (!accessToken) {
        throw new Error('No access token available');
    }

    const perPage = 200;
    let page = 1;
    let allActivities = [];
    let hasMore = true;

    const { after, before } = params;

    while (hasMore) {
        const url = new URL('https://www.strava.com/api/v3/athlete/activities');
        url.searchParams.append('per_page', perPage.toString());
        url.searchParams.append('page', page.toString());
        if (after) url.searchParams.append('after', after.toString());
        if (before) url.searchParams.append('before', before.toString());

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching activities');
        }

        const activities = await response.json();

        allActivities = allActivities.concat(activities);

        if (activities.length < perPage) {
            hasMore = false;
        } else {
            page += 1;
        }
    }

    return allActivities;
};
