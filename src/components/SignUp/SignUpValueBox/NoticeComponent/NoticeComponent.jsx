import './NoticeComponent.css';
export default function NoticeComponent({ sort }) {
	return (
		<>
			{sort === 'dataExists' ? (
				<div className="noticeInvalidInputValue">Already exists in DB</div>
			) : null}

			{sort === 'invalidRegexName' ? (
				<div className="noticeInvalidInputValue">
					Username must be 5~20 characters consisting of lowercase letters(a-z),
					numbers, or special characters (_, -)
				</div>
			) : null}

			{sort === 'invalidRegexPassword' ? (
				<div className="noticeInvalidInputValue">
					Password must be 8~16 characters consisting of letters(A-Z, a-z),
					numbers, or special characters.
				</div>
			) : null}

			{sort === 'passwordCrossCheckNoMatch' ? (
				<div className="noticeInvalidInputValue">
					This value must be same with the value you've input above
				</div>
			) : null}

			{sort === 'invalidRegexEmail' ? (
				<div className="noticeInvalidInputValue">
					This value must have proper email form
				</div>
			) : null}

			{sort === 'emptyValue' ? (
				<div className="noticeInvalidInputValue">Please input this value</div>
			) : null}

			{sort === 'validateCodeSent' ? (
				<div id="noticeValidateCodeSent">
					Validate code has been sent to your email
				</div>
			) : null}
		</>
	);
}
