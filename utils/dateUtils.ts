import dayjs from 'dayjs';

export const getDateRange = (month?: string | string[]) => {
    if (month) {
        const startOfMonth = dayjs(month as string).startOf('month').unix();
        const endOfMonth = dayjs(month as string).endOf('month').unix();
        return { after: startOfMonth, before: endOfMonth };
    } else {
        const today = dayjs().endOf('day');
        const fourWeeksAgo = dayjs().subtract(4, 'weeks').startOf('day');
        return { after: fourWeeksAgo.unix(), before: today.unix() };
    }
};