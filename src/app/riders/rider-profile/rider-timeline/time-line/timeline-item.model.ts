export type TimeLineItemIcon = 'default' | 'start' | 'finish' | 'lose' | 'win';

export interface TimeLineItem {
    title: string;
    time: Date;
    content: string;
    icon: TimeLineItemIcon;
}
