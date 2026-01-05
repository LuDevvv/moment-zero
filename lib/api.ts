
export interface MomentData {
    username: string;
    message: string;
    theme: string;
    atmosphere: string;
    typography: string;
    targetYear?: number;
    isPublic?: boolean;
}

export async function saveMoment(data: MomentData) {
    try {
        const res = await fetch('/api/moments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorData = await res.json().catch(() => ({})) as any;
            throw {
                status: res.status,
                message: errorData.error || "Failed to save moment",
                isDuplicate: errorData.error === "Username already taken"
            };
        }

        return await res.json();
    } catch (error: any) {
        throw error.status ? error : { message: "Network error", isNetwork: true };
    }
}

export async function updateMoment(data: MomentData) {
    try {
        const res = await fetch('/api/moments', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorData = await res.json().catch(() => ({})) as any;
            throw {
                status: res.status,
                message: errorData.error || "Failed to update moment"
            };
        }

        return await res.json();
    } catch (error: any) {
        throw error.status ? error : { message: "Network error", isNetwork: true };
    }
}
