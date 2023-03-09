export default function NoticeInvalidInputValue({ sort }) {
	return (
		<div className="noticeInvalidInputValue">
			{sort === 'name' ? (
				<p>
					5~20 characters consisting of lowercase letters(a-z), numbers, or
					special characters (_, -)
				</p>
			) : null}
			{sort === 'password' ? <p>비밀번호 잘 좀 입력해봐</p> : null}
			{sort === 'passwordCrossCheck' ? <p>비밀번호 똑같이 넣어야지</p> : null}
			{sort === 'email' ? <p>이메일 형식 확인해</p> : null}
		</div>
	);
}
