import { notifications } from "@mantine/notifications";
import {Cross1Icon} from "@radix-ui/react-icons";

export function ShowError(title, message) {
	notifications.show({
		title: title,
		message: message,
		withCloseButton: true,
		autoClose: 5000,
		color: "red",
		icon: <Cross1Icon />,
		loading: false,
	});
}

export function ShowSuccess(title, message) {
	notifications.show({
		title: title,
		message: message,
		withCloseButton: true,
		autoClose: 5000,
		color: "green",
		loading: false,
	});
}

export function ShowInfo(title, message) {
	notifications.show({
		title: title,
		message: message,
		withCloseButton: true,
		autoClose: 5000,
		color: "blue",
		loading: false,
	});
}