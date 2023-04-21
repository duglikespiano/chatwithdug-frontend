import './NoticeValidateCodeCheckResult.css';
export default function NoticeValidateCodeCheckResult({ props }) {
	return props ? (
		<div id="noticeValidateCodeCheckResult">Validate code confirmed</div>
	) : (
		<div id="noticeValidateCodeCheckResult">Wrong validate code</div>
	);
}
