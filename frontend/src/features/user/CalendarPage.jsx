import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentMonthTasks } from "../../app/slices/taskSlice";
import CalendarView from "./CalenderView";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

const CalendarPage = () => {
    const dispatch = useDispatch();
    const today = new Date();
    const startDate = startOfWeek(startOfMonth(today));
    const endDate = endOfWeek(endOfMonth(today));

    const formatDates = (input) => {
        return input.toISOString().split('T')[0];
    }
    useEffect(() => {
        let url = '/calendar-tasks';
        url = `${url}?startDate=${formatDates(startDate)}&endDate=${formatDates(endDate)}`;
        dispatch(fetchCurrentMonthTasks(url))
    }, []);


    return (
        <>
            <CalendarView startDate={startDate} endDate={endDate} />
        </>
    );
};

export default CalendarPage;
