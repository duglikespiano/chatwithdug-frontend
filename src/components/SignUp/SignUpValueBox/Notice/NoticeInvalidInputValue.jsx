import './NoticeInvalidInputValue.css';
export default function NoticeInvalidInputValue({ sort }) {
	return (
		<div className="noticeInvalidInputValue">
			{sort === 'name' ? (
				<div>
					Username must be 5~20 characters consisting of lowercase letters(a-z),
					numbers, or special characters (_, -)
				</div>
			) : null}
			{sort === 'password' ? (
				<div>
					Password must be 8~16 characters consisting of letters(A-Z, a-z),
					numbers, or special characters.
				</div>
			) : null}
			{sort === 'passwordCrossCheck' ? (
				<div>This value must be same with the value you've input above</div>
			) : null}
			{sort === 'email' ? (
				<div>This value must have proper email form</div>
			) : null}
		</div>
	);
}
