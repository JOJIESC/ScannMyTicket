import React,{ReactNode} from 'react'

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
  }

function AddOperatorModal({show, onClose, children}: ModalProps) {
    if (!show){
        return null;
    }


return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 relative min-w-96" onClick={(e) => e.stopPropagation()}>
            {/* Add your modal content here */}
            {children}
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
)
}

export default AddOperatorModal
