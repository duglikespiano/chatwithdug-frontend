import { useState, useEffect, useRef } from 'react';
import './SignUpValueBox.css';
import NoticeComponent from './NoticeComponent/NoticeComponent.jsx';
import NoticeValidateCodeCheckResult from './NoticeComponent/NoticeValidateCodeCheckResult.jsx';

export default function SignUpValueBox({ sort, getData }) {
	//------------------------------ regex ------------------------------//
	// 사용자가 입력한 값들의 유효성 검사에 필요한 regular expressions
	const nameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;
	const emailRegex = /^[a-zA-Z0-9+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

	//------------------------------ state ------------------------------//
	// 사용자가 입력한 값들을 저장하는 state
	const [values, setValues] = useState({});

	// 사용자의 focus가 있었는지 여부를 저장하는 state
	const [touched, setTouched] = useState({});

	// 사용자의 입력한 값이 정규식을 만족하는지 저장하는 state
	const [regexTest, setRegexTest] = useState({});

	// 사용자가 입력한 ID와 email이 DB에 이미 저장되어 있는지 확인 및 저장하는 state
	const [checkDataExists, setCheckDataExists] = useState(false);

	//---------------------------email HTML관련 state---------------------------//
	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state
	const [validateCodeBoxToggle, setValidateCodeBoxToggle] = useState(false);
	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state의 handler
	const handleEmailValidateCodeBoxToggle = () => {
		setValidateCodeBoxToggle(
			(validateCodeBoxToggle) =>
				(validateCodeBoxToggle = !validateCodeBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state
	// 사용자가 입력한 인증코드가 6자리가 될 경우에만 인증코드일치 확인요청 버튼이 활성화 됨
	const [validateCodeInputCheck, setValidateCodeInputCheck] = useState(false);
	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state의 handler
	const handleValidateCodeInputCheck = () => {
		if (emailValidateCheckInputBox.current.value.trim().length === 6) {
			setValidateCodeInputCheck(true);
		} else {
			setValidateCodeInputCheck(false);
		}
	};

	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state
	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state의 handler
	const [validateCodeInputBoxToggle, setValidateCodeInputBoxToggle] =
		useState(false);

	// email인증코드 발송관련 html 중 email의 input box disabled 여부를 저장하는 state
	// 사용자가 인증코드를 요청하면 email의 input box가 비활성화 됨
	const [emailInputBoxToggle, setEmailInputBoxToggle] = useState(false);
	// email인증코드 발송관련 html 중 email의 input box disabled 여부를 저장하는 state의 handler
	const handleEmailInputBoxToggle = () => {
		setEmailInputBoxToggle(
			(emailInputBoxToggle) => (emailInputBoxToggle = !emailInputBoxToggle)
		);
	};

	// 사용자가 인증코드를 입력 후 확인 버튼을 눌렀는지 확인 하는 state
	// 사용자의 인증코드가 확인 된 경우에만 true로 변환
	const [checkSubmitValidateCode, setCheckSubmitValidateCode] = useState(false);

	//---------------------------validateCode Check logic관련 state---------------------------//
	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state
	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state의 hanlder
	// 사용자가 인증코드를 기입 및 전송 후 새로운 email을 적용하기 위해 취소 버튼을 누를 시, 해당상태를 초기화
	const [validateCodeMatchCheck, setValidateCodeMatchCheck] = useState(false);

	// email이 유효성 검사, 중복여부 검사, 인증코드일치 검사 통과 여부를 저장하는 state
	const [checkIfEmailConfirmed, setCheckIfEmailConfirmed] = useState(false);
	// email이 유효성 검사, 중복여부 검사, 인증코드일치 검사 통과 여부를 저장하는 state의 handler
	// 사용자가 인증코드를 기입 및 전송 후 새로운 email을 적용하기 위해 취소 버튼을 누를 시, 해당상태를 초기화

	//------------------------------ handler ------------------------------//
	// 사용자가 입력한 값들을 저장하는 state의 handler
	const handleValue = (sort) => {
		setValues({
			...values,
			[sort.current.name]: sort.current.value,
		});
	};

	// 사용자의 focus가 있었는지 여부를 저장하는 state의 hanlder
	const handleValueTouched = (sort) => {
		if (touched[sort.current.name] === undefined) {
			setTouched({
				...touched,
				[sort.current.name]: true,
			});
		}
	};

	// 사용자의 입력한 값이 정규식을 만족하는지 저장하는 state의 handler
	const handleSetRegexTest = (sort) => {
		let regexSort;
		if (sort.current.name === 'name') {
			regexSort = nameRegex;
		} else if (sort.current.name === 'password') {
			regexSort = passwordRegex;
		} else if (sort.current.name === 'email') {
			regexSort = emailRegex;
		}
		setRegexTest({
			...regexTest,
			[sort.current.name]: regexSort.test(sort.current.value),
		});
	};

	//------------------------------ fetch ------------------------------//
	// 사용자가 입력한 ID와 email이 DB에 이미 저장되어 있는지 DB에 확인 요청하는 fetch
	const fetchData = (sort, value) => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/users/signup?sort=${sort}&value=${value}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.data.length === 0) {
					setCheckDataExists(false);
				} else {
					setCheckDataExists(true);
				}
			});
	};

	// 사용자가 입력한 email로 인증코드를 요청하는 fetch
	// 호출 시 서버에서 사용자에게 메일을 발송
	const requestValidateCode = () => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/mail/validatecode?email=${emailInputBox.current.value}`
		)
			.then((res) => res.json())
			.catch((error) => console.error(error));
	};

	// 사용자가 email로 받은 인증코드를 페이지에 입력할 때, 해당 값의 유효성을 서버에 확인 요청하는 fetch
	const checkValidateCode = () => {
		const fetchData = {
			email: emailInputBox.current.value,
			validateCode: emailValidateCheckInputBox.current.value,
		};

		fetch(`${process.env.REACT_APP_BACKEND_URL}/mail/validatecode`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fetchData),
		})
			.then((res) => res.json())
			.then((data) => {
				return data.result;
			})
			.then((result) => {
				if (result === false) {
					const error = new Error('VALIDATE CODE NOT MATCHED');
					throw error;
				} else if (result === true) {
					setValidateCodeMatchCheck(true);
					setCheckSubmitValidateCode(true);
					setValidateCodeInputBoxToggle(true);
					setCheckIfEmailConfirmed(true);
				}
			})
			.catch((error) => {
				console.error(error);
				setValidateCodeInputBoxToggle(true);
			});
	};

	//------------------------------ ref ------------------------------//

	//사용자가 입력하는 name input 감지를 위한 useRef
	const nameInputBox = useRef();

	//사용자가 입력하는 password input 감지를 위한 useRef
	const passwordInputBox = useRef();

	//사용자가 입력하는 password crosscheck input 감지를 위한 useRef
	const passwordCrossCheckInputBox = useRef();

	// 사용자가 입력하는 email input 감지를 위한 useRef
	const emailInputBox = useRef();

	// 사용자가 입력하는 email validate code 감지를 위한 useRef
	const emailValidateCheckInputBox = useRef();

	//------------------------------ effect ------------------------------//
	// 유효성 검사, 중복여부 검사, 인증코드일치 검사 후 이메일이 확인되었다는 값을 부모 component로 전달하기 위한 useEffect
	// getData함수 자체는 자식 component의 값을 부모 component로 올려주는 역할을 담당
	// useEffect를 사용하지 않을 시, 제출 시점과 state가 일치하지 않는 경우가 발생
	useEffect(() => {
		getData('emailConfirm', checkIfEmailConfirmed);
		// eslint-disable-next-line
	}, [checkIfEmailConfirmed]);

	return (
		<>
			{/* sort가 id일 경우 id값 입력을 위한 컴포넌트 반환 */}
			{sort === 'name' ? (
				<div className="elementRow">
					<div className="valueSort">Username</div>
					<input
						className="valueInputBox"
						ref={nameInputBox}
						type="text"
						name="name"
						maxLength="15"
						onChange={() => {
							handleValue(nameInputBox);
							handleSetRegexTest(nameInputBox);
							fetchData('name', nameInputBox.current.value);
							getData(nameInputBox.current.name, nameInputBox.current.value);
						}}
						autoComplete="none"
						onBlur={() => {
							handleValueTouched(nameInputBox);
						}}
					/>
					{/*   */}
					{/* 사용자가 값을 입력 할 때 마다 이미 DB에 등록 된 값인지 확인하여 안내문구 출력 */}
					{checkDataExists ? <NoticeComponent sort={'dataExists'} /> : null}
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!nameInputBox.current?.value && touched.name ? (
						<NoticeComponent sort={'emptyValue'} />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{nameInputBox.current?.value && !regexTest.name ? (
						<NoticeComponent sort={'invalidRegexName'} />
					) : null}
				</div>
			) : null}
			{/*   */}
			{/*   */}
			{/* sort가 password일 경우 password값 입력을 위한 컴포넌트 반환 */}
			{sort === 'password' ? (
				<div className="elementRow">
					<div className="valueSort">Password</div>
					<input
						className="valueInputBox"
						type="password"
						ref={passwordInputBox}
						autoComplete="none"
						name="password"
						maxLength="16"
						onChange={() => {
							handleValue(passwordInputBox);
							handleSetRegexTest(passwordInputBox);
							getData(
								passwordInputBox.current.name,
								passwordInputBox.current.value
							);
						}}
						onBlur={() => {
							handleValueTouched(passwordInputBox);
						}}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!passwordInputBox.current?.value && touched.password ? (
						<NoticeComponent sort={'emptyValue'} />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{passwordInputBox.current?.value && regexTest.password === false ? (
						<NoticeComponent sort={'invalidRegexPassword'} />
					) : null}
				</div>
			) : null}
			{/*   */}
			{/*   */}
			{/* sort가 passwordCrossCheck일 경우 password값과 passwordCrossCheck값의 일치를 확인하는 컴포넌트 반환 */}
			{sort === 'passwordCrossCheck' ? (
				<div className="elementRow">
					<div className="valueSort">Password Confirm</div>
					<input
						type="password"
						className="valueInputBox"
						autoComplete="none"
						name="passwordCrossCheck"
						ref={passwordCrossCheckInputBox}
						onChange={() => {
							handleValue(passwordCrossCheckInputBox);
							getData(
								passwordCrossCheckInputBox.current.name,
								passwordCrossCheckInputBox.current.value
							);
						}}
						onBlur={() => {
							handleValueTouched(passwordCrossCheckInputBox);
						}}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{document.getElementsByClassName('valueInputBox')[1]?.value !==
					passwordCrossCheckInputBox.current?.value ? (
						<NoticeComponent sort={'passwordCrossCheckNoMatch'} />
					) : null}
					{!passwordCrossCheckInputBox.current?.value &&
					touched.passwordCrossCheck ? (
						<NoticeComponent sort={'emptyValue'} />
					) : null}
				</div>
			) : null}
			{/*   */}
			{/*   */}
			{/* sort가 email일 경우 email값 입력을 위한 컴포넌트 반환 */}
			{sort === 'email' ? (
				<div className="elementRow">
					<div className="valueSort">Email</div>
					<input
						ref={emailInputBox}
						disabled={emailInputBoxToggle}
						type="email"
						className="valueInputBox"
						name="email"
						autoComplete="none"
						onChange={() => {
							handleValue(emailInputBox);
							handleSetRegexTest(emailInputBox);
							fetchData('email', emailInputBox.current.value);
							getData(emailInputBox.current.name, emailInputBox.current.value);
						}}
						onBlur={() => {
							handleValueTouched(emailInputBox);
						}}
					/>
					<button
						type="button"
						onClick={() => {
							handleEmailInputBoxToggle();
							handleEmailValidateCodeBoxToggle();
							requestValidateCode();
						}}
						disabled={
							!regexTest.email || checkDataExists || emailInputBoxToggle
						}
						className="validateCodeSendButton"
					>
						Send validate code
					</button>
					{/*   */}
					{/* 사용자가 값을 입력 할 때 마다 이미 DB에 등록 된 값인지 확인하여 안내문구 출력 */}
					{checkDataExists ? <NoticeComponent sort={'dataExists'} /> : null}
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!emailInputBox.current?.value && touched.email ? (
						<NoticeComponent sort={'emptyValue'} />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{emailInputBox.current?.value && !regexTest.email ? (
						<NoticeComponent sort={'invalidRegexEmail'} />
					) : null}

					{/* email이 정규식을 통과하고 validatecode가 발송되었을 때, 하기 html이 toggle됨 */}
					{validateCodeBoxToggle ? (
						<div>
							<input
								id="emailValidateCodeInput"
								disabled={validateCodeMatchCheck}
								autoFocus={true}
								ref={emailValidateCheckInputBox}
								onChange={handleValidateCodeInputCheck}
								maxLength="6"
							/>
							<button
								className="emailValidateCodeButton"
								type="button"
								onClick={() => {
									setValidateCodeInputBoxToggle(false);
									checkValidateCode();
								}}
								disabled={!validateCodeInputCheck || checkSubmitValidateCode}
							>
								Confirm
							</button>
							<button
								type="button"
								className="emailCancelButton"
								onClick={() => {
									//HTML관련 toggle
									handleEmailValidateCodeBoxToggle();
									handleEmailInputBoxToggle();
									setValidateCodeInputBoxToggle(false);
									setCheckSubmitValidateCode(false);
									//validateCode 확인 관련 logic toggle
									setValidateCodeMatchCheck(false);
									setCheckIfEmailConfirmed(false);
									handleValidateCodeInputCheck();
									setValidateCodeInputCheck(false);
								}}
							>
								Cancel
							</button>
							<NoticeComponent sort={'validateCodeSent'} />
							{validateCodeInputBoxToggle ? (
								<NoticeValidateCodeCheckResult props={validateCodeMatchCheck} />
							) : null}
						</div>
					) : null}
				</div>
			) : null}{' '}
		</>
	);
}
