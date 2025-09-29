
// Alert.tsx
type AlertProps = {
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export default function Alert({ message, onConfirm, onCancel }: AlertProps) {
    return (
        <div style={{ border: '1px solid #aaa', padding: 12 }}>
            <p>{message}</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {onConfirm && <button onClick={onConfirm}>확인</button>}
                {onCancel && <button onClick={onCancel}>취소</button>}
            </div>
        </div>
    );
}
