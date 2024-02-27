import type { ReactNode } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

export const Notification = ({
	header,
	success,
	children,
}: NotificationProps) => {
	const [show, setShow] = useState(true);

	const onClickClose = () => {
		setShow(false);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(false);
		}, 1000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<>
			<div
				aria-live="assertive"
				className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:p-6">
				<div className="flex w-full flex-col items-center space-y-4">
					<Transition
						show={show}
						as={Fragment}
						enter="transform ease-out duration-300 transition"
						enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
						enterTo="translate-y-0 opacity-100 sm:translate-x-0"
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
							<div className="p-4">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										{!!success && (
											<CheckCircleIcon
												className="h-6 w-6 text-emerald-400"
												aria-hidden="true"
											/>
										)}
									</div>
									<div className="ml-3 w-0 flex-1 pt-0.5">
										<p className="text-tuscan-900 text-sm font-medium">
											{header}
										</p>
										<p className="text-tuscan-500 mt-1 text-sm">
											{children}
										</p>
									</div>
									<div className="ml-4 flex flex-shrink-0">
										<button
											type="button"
											className="text-tuscan-400 hover:text-tuscan-500 inline-flex rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
											onClick={onClickClose}>
											<span className="sr-only">
												Close
											</span>
											<XMarkIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
										</button>
									</div>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</>
	);
};

interface NotificationProps {
	header: string;
	success?: boolean;
	children?: ReactNode;
}
