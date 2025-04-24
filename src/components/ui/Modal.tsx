interface ModalProps {
    message: string;
    isError: boolean;
    onClose: () => void;
  }
  
  export function Modal({ message, isError, onClose }: ModalProps) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h3 className={`text-center text-lg font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {isError ? 'Error' : 'Success'}
          </h3>
          <p className="text-center mt-4">{message}</p>
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  