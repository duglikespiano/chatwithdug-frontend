import './NoticeValidateCodeCheckResult.css';
export default function NoticeValidateCodeCheckResult({ props }) {
	return props ? (
		<span id="noticeValidateCodeCheckResult">Validate code confirmed</span>
	) : (
		<span id="noticeValidateCodeCheckResult">Wrong validate code</span>
	);
}
