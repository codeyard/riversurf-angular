export type TimelineItemIcon = 'default' | 'start' | 'finish' | 'loose' | 'win';

export interface TimelineItem {
    title: string;
    time: Date;
    content: string;
    icon: TimelineItemIcon;
}

export const DefaultTimelineItem : TimelineItem = {
    title : "",
    content : "",
    time : new Date(),
    icon : "default"
}

export const DefaultTimelineItems: TimelineItem[] = [{
    title: "Rides in heat 2 of round 1",
    content: "",
    time: new Date(2021, 9, 11, 12, 1),
    icon: "start"
}, {
    title: "Won heat 2 of round 1",
    content: "Scored 30 points",
    time: new Date(2021, 9, 11, 12, 34),
    icon: "default"
}, {
    title: "Rides in heat 3 of round 2",
    content: "",
    time: new Date(2021, 9, 11, 13, 15),
    icon: "default"
}, {
    title: "Won heat 3 of round 2",
    content: "Scored 24 points",
    time: new Date(2021, 9, 11, 13, 41),
    icon: "default"
}, {
    title: "Rides in heat 1 of round 3",
    content: "",
    time: new Date(2021, 9, 11, 15, 20),
    icon: "default"
}, {
    title: "Won heat 1 of round 3",
    content: "Scored 41 points",
    time: new Date(2021, 9, 11, 15, 59),
    icon: "default"
}, {
    title: "Won the competition",
    content: "",
    time: new Date(2021, 9, 11, 15, 59),
    icon: "win"
}
]
