import { useToast } from "../components/Notification/Toast";

const copyToClipboard = async (text, onCopy) => {
    const showToast = useToast();

    if ('clipboard' in navigator) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard');
            showToast(text + ' Copied Successfully!', 'success');
            if (onCopy) {
                onCopy(true);
            }
        } catch (err) {
            showToast(text+' failed to copy!', 'error');
            console.error('Failed to copy: ', err);
            if (onCopy) {
                onCopy(false);
            }
        }
    } else {
        showToast('Clipboard not Supported!', 'warning');
        console.error('Clipboard not supported');
        if (onCopy) {
            onCopy(false);
        }
    }
};
