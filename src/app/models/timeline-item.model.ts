export type TimeLineItemIcon = 'default' | 'start' | 'finish' | 'loose' | 'win';

export interface TimeLineItem {
    title: string;
    time: Date;
    content: string;
    icon: TimeLineItemIcon;
}

export const DefaultTimeLineItem : TimeLineItem = {
    title : "",
    content : "",
    time : new Date(),
    icon : "default"
}

export const DefaultTimeLineItemsWinning: TimeLineItem[] = [{
    title: "Rides in heat 2 of round 1",
    content: "",
    time: new Date(2021, 9, 11, 12, 1),
    icon: "start"
}, {
    title: "Won heat 2 of round 1",
    content: "Scored 30 points",
    time: new Date(2021, 9, 11, 12, 34),
    icon: "finish"
}, {
    title: "Rides in heat 3 of round 2",
    content: "",
    time: new Date(2021, 9, 11, 13, 15),
    icon: "start"
}, {
    title: "Won heat 3 of round 2",
    content: "Scored 24 points",
    time: new Date(2021, 9, 11, 13, 41),
    icon: "finish"
}, {
    title: "Rides in heat 1 of round 3",
    content: "",
    time: new Date(2021, 9, 11, 15, 20),
    icon: "start"
}, {
    title: "Won heat 1 of round 3",
    content: "Scored 41 points",
    time: new Date(2021, 9, 11, 15, 59),
    icon: "finish"
}, {
    title: "Won the competition",
    content: "",
    time: new Date(2021, 9, 11, 15, 59),
    icon: "win"
}
]

export const DefaultTimeLineItemsLoosing: TimeLineItem[] = [{
    title: "Rides in heat 2 of round 1",
    content: "",
    time: new Date(2020, 9, 11, 12, 1),
    icon: "start"
}, {
    title: "Won heat 2 of round 1",
    content: "Scored 30 points",
    time: new Date(2020, 9, 11, 12, 34),
    icon: "finish"
}, {
    title: "Rides in heat 3 of round 2",
    content: "",
    time: new Date(2020, 9, 11, 13, 15),
    icon: "start"
}, {
    title: "Won heat 3 of round 2",
    content: "Scored 24 points",
    time: new Date(2020, 9, 11, 13, 41),
    icon: "finish"
}, {
    title: "Rides in heat 1 of round 3",
    content: "",
    time: new Date(2020, 9, 11, 15, 20),
    icon: "start"
}, {
    title: "Lost in heat 1 of round 3",
    content: "Scored 12 points",
    time: new Date(2020, 9, 11, 15, 59),
    icon: "loose"
}
]

export const DefaultTimeLineItemsOngoing: TimeLineItem[] = [{
    title: "Rides in heat 2 of round 1",
    content: "",
    time: new Date(2021, 9, 11, 12, 1),
    icon: "start"
}, {
    title: "Won heat 2 of round 1",
    content: "Scored 30 points",
    time: new Date(2021, 9, 11, 12, 34),
    icon: "finish"
}, {
    title: "Rides in heat 3 of round 2",
    content: "",
    time: new Date(2021, 9, 11, 13, 15),
    icon: "start"
}, {
    title: "Won heat 3 of round 2",
    content: "Scored 24 points",
    time: new Date(2021, 9, 11, 13, 41),
    icon: "finish"
}, {
    title: "Rides in heat 1 of round 3",
    content: "",
    time: new Date(2021, 9, 11, 15, 20),
    icon: "start"
}
]
