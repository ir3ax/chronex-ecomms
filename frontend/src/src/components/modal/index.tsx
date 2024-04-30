import React, { useRef, Fragment } from 'react';
import { Dialog, Transition} from '@headlessui/react';
import { classNames } from '../../utility/common';
interface ModalProps {
	children: React.ReactNode;
	closeable?: boolean;
	close?: boolean;
	open: boolean;
	className?: string;
	onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, className, closeable = false, children }) => {
	const cancelButtonRef = useRef(null);
	
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-50 inset-0 overflow-y-auto md:overflow-hidden md:m-4 lg:overflow-y-auto lg:m-0"
				initialFocus={cancelButtonRef}
				onClose={closeable ? onClose : () => { return; }}
			>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div
							className={classNames(
								className ? className : 'w-auto',
								'inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle m-auto',
							)}
						>
							{children}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root> 
	);
};