import useSWRMutation from 'swr/mutation';
const API_URL = import.meta.env.VITE_URL_API;

function useFetchData(url) {

    const sendRequest = async (url, { arg }) => {

        const { method, body, headers } = arg;
        if (!method || !body) {
            throw new Error(`Invalid arguments: ${JSON.stringify(arg)}`);
        }

        const response = await fetch(`${API_URL}${url}`, {
            method: method,
            headers: {
                ...(headers || {}),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const res = await response.json();
            const msg = res?.error?.message;
            throw new Error(`${msg || 'Request failed'}`);
        }
        return response.json();
    };

    const { trigger, error, isMutating } = useSWRMutation(url, sendRequest);

    return {
        trigger,
        error,
        isMutating
    };
}

export default useFetchData;
