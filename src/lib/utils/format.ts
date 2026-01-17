export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

export function formatDate(dateString: string | undefined): string {
	if (!dateString) return 'Unknown';

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return 'Invalid date';

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function formatRelativeTime(dateString: string | undefined): string {
	if (!dateString) return 'Unknown';

	const date = new Date(dateString);
	if (isNaN(date.getTime())) return 'Invalid date';

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffWeeks = Math.floor(diffDays / 7);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
	if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
	if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
	if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
	if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
	if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
	return 'Just now';
}

export function truncateDigest(digest: string): string {
	if (!digest) return '';
	// Format: sha256:abc123... -> sha256:abc123
	const [algo, hash] = digest.split(':');
	if (!hash) return digest;
	return `${algo}:${hash.substring(0, 12)}`;
}
