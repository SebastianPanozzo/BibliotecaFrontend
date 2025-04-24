import useSWRMutation from 'swr/mutation';

function useFetchData(url) {

    const sendRequest = async (url, { arg }) => {
        const { method, body } = arg;
        if (!method || !body) {
            throw new Error(`Invalid arguments: ${JSON.stringify(arg)}`);
        }

        const api_key = import.meta.env.VITE_API_KEY;
        const response = await fetch(url, {
            method: method,
            headers: {
                'api-key': api_key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
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


