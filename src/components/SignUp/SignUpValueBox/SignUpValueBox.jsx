import { useState, useEffect, useRef } from 'react';
import './SignUpValueBox.css';
import NoticeEmptyInputValue from './Notice/NoticeEmptyInputValue.jsx';
import NoticeInvalidInputValue from './Notice/NoticeInvalidInputValue.jsx';
import NoticeDataExists from './Notice/NoticeDataExists.jsx';
import NoticeValidateCodeSent from './Notice/NoticeValidateCodeSent.jsx';
import NoticeValidateCodeCheckResult from './Notice/NoticeValidateCodeCheckResult.jsx';

export default function SignUpValueBox({ sort, getData }) {
	//------------------------------ regex ------------------------------//
	// 사용자가 입력한 값들의 유효성 검사에 필요한 regular expressions
	const nameRegex = /[a-z0-9_-]{5,15}/;
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

	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state
	const [validateCodeBoxToggle, setValidateCodeBoxToggle] = useState(false);

	// email인증코드 발송관련 html 중 email의 input box disabled 여부를 저장하는 state
	// 사용자가 인증코드를 요청하면 email의 input box가 비활성화 됨
	const [emailInputBoxToggle, setEmailInputBoxToggle] = useState(false);

	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state
	// 사용자가 인증코드를 입력 후, 확인버튼을 누르면 인증코드의 input box가 비활성화 됨
	const [validateCodeInputBoxToggle, setValidateCodeInputBoxToggle] =
		useState(false);

	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state
	// 사용자가 입력한 인증코드가 6자리가 될 경우에만 인증코드일치 확인요청 버튼이 활성화 됨
	const [validateCodeInputCheck, setValidateCodeInputCheck] = useState(false);

	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state
	const [validateCodeMatchCheck, setValidateCodeMatchCheck] = useState(false);

	// email이 유효성 검사, 중복여부 검사, 인증코드일치 검사 통과 여부를 저장하는 state
	const [checkIfEmailConfirmed, setCheckIfEmailConfirmed] = useState(false);

	//------------------------------ handler ------------------------------//
	// 사용자가 입력한 값들을 저장하는 state의 handler
	const handleValue = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	// 사용자의 focus가 있었는지 여부를 저장하는 state의 hanlder
	const handleValueTouched = (event) => {
		if (touched[event.target.name] === undefined) {
			setTouched({
				...touched,
				[event.target.name]: true,
			});
		}
	};

	// 사용자의 입력한 값이 정규식을 만족하는지 저장하는 state의 handler
	const handleSetRegexTest = (event) => {
		if (event.target.name === 'name') {
			setRegexTest({
				...regexTest,
				[event.target.name]: nameRegex.test(event.target.value),
			});
		} else if (event.target.name === 'password') {
			setRegexTest({
				...regexTest,
				[event.target.name]: passwordRegex.test(event.target.value),
			});
		} else if (event.target.name === 'email') {
			setRegexTest({
				...regexTest,
				[event.target.name]: emailRegex.test(event.target.value),
			});
		}
	};

	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state의 handler
	const handleEmailValidateCodeBoxToggle = () => {
		setValidateCodeBoxToggle(
			(emailValidateCodeBoxToggle) =>
				(emailValidateCodeBoxToggle = !emailValidateCodeBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email의 input box disabled 여부를 저장하는 state의 handler
	const handleEmailInputBoxToggle = () => {
		setEmailInputBoxToggle(
			(emailInputBoxToggle) => (emailInputBoxToggle = !emailInputBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state의 handler
	const handleSetEmailValidateInputBoxToggle = () => {
		setValidateCodeInputBoxToggle(
			(emailValidateCheckInputBoxToggle) =>
				(emailValidateCheckInputBoxToggle = !emailValidateCheckInputBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state의 handler
	const handleValidateCodeInputCheck = () => {
		if (emailValidateCheckInputBox.current.value.trim().length === 6) {
			setValidateCodeInputCheck(
				(validateCodeInputCheck) => (validateCodeInputCheck = true)
			);
		} else {
			setValidateCodeInputCheck(
				(validateCodeInputCheck) => (validateCodeInputCheck = false)
			);
		}
	};

	// 사용자가 인증코드를 입력 후 확인 버튼을 눌렀는지 확인 하는 state
	const [checkSumbitValidateCode, setCheckSubmitValidateCode] = useState(false);

	// 사용자가 입력한 인증코드가 옳든 그르든 우선 입력 후에는 true로 전환
	const handleSetCheckSubmitValidateCode = () => {
		setCheckSubmitValidateCode(
			(checkSumbitValidateCode) =>
				(checkSumbitValidateCode = !checkSumbitValidateCode)
		);
	};

	const handleResetValidateCodeInputCheck = () => {
		setValidateCodeInputCheck(
			(validateCodeInputCheck) => (validateCodeInputCheck = false)
		);
	};

	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state의 hanlder
	// 사용자가 인증코드를 기입 및 전송 후 새로운 email을 적용하기 위해 취소 버튼을 누를 시, 해당상태를 초기화
	const handleValidateCodeMatchCheck = () => {
		setValidateCodeMatchCheck(
			(validateCodeMatchCheck) => (validateCodeMatchCheck = false)
		);
	};

	// email이 유효성 검사, 중복여부 검사, 인증코드일치 검사 통과 여부를 저장하는 state의 handler
	// 사용자가 인증코드를 기입 및 전송 후 새로운 email을 적용하기 위해 취소 버튼을 누를 시, 해당상태를 초기화
	const handleEmailConfirm = () => {
		setCheckIfEmailConfirmed((emailConfirm) => (emailConfirm = false));
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
					setCheckDataExists((checkDataExists) => (checkDataExists = false));
				} else {
					setCheckDataExists((checkDataExists) => (checkDataExists = true));
				}
			});
	};

	// 사용자가 입력한 email로 인증코드를 요청하는 fetch
	// 호출 시 서버에서 사용자에게 메일을 발송
	const requestValidateCode = () => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/validatecode?email=${emailInputBox.current.value}`
		)
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
	};

	// 사용자가 email로 받은 인증코드를 페이지에 입력할 때, 해당 값의 유효성을 서버에 확인 요청하는 fetch
	const checkValidateCode = () => {
		const fetchData = {
			email: emailInputBox.current.value,
			validateCode: emailValidateCheckInputBox.current.value,
		};

		fetch(`${process.env.REACT_APP_BACKEND_URL}/validateCode`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fetchData),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				return data.message;
			})
			.then((message) => {
				if (message === 'INVALID CODE') {
					const error = new Error('INVALID CODE');
					throw error;
				} else if (message === 'VALIDATE CODE CONFIRMED') {
					setValidateCodeMatchCheck(
						(validateCodeMatchCheck) => (validateCodeMatchCheck = true)
					);
				}
			})
			.then(() => {
				setCheckIfEmailConfirmed((emailConfirm) => (emailConfirm = true));
			})
			.catch((error) => console.error(error));
	};

	//------------------------------ ref ------------------------------//
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
						type="text"
						name="name"
						maxLength="15"
						onChange={(event) => {
							handleValue(event);
							handleSetRegexTest(event);
							fetchData('name', event.target.value);
							getData(event.target.name, event.target.value);
						}}
						onBlur={(event) => {
							handleValueTouched(event);
						}}
					/>
					{/*   */}
					{/* 사용자가 값을 입력 할 때 마다 이미 DB에 등록 된 값인지 확인하여 안내문구 출력 */}
					{checkDataExists === true ? <NoticeDataExists /> : null}
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.name && touched.name ? <NoticeEmptyInputValue /> : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{(values.name && regexTest.name === false) ||
					values.name?.includes(' ') ? (
						<NoticeInvalidInputValue sort={'name'} />
					) : null}
				</div>
			) : null}
			{/*   */}
			{/* sort가 password일 경우 password값 입력을 위한 컴포넌트 반환 */}
			{sort === 'password' ? (
				<div className="elementRow">
					<div className="valueSort">Password</div>
					<input
						className="valueInputBox"
						type="password"
						autoComplete="none"
						name="password"
						maxLength="16"
						onChange={(event) => {
							handleValue(event);
							handleSetRegexTest(event);
							getData(event.target.name, event.target.value);
						}}
						onBlur={(event) => {
							handleValueTouched(event);
						}}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.password && touched.password ? (
						<NoticeEmptyInputValue />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{(values.password && regexTest.password === false) ||
					values.password?.includes(' ') ? (
						<NoticeInvalidInputValue sort={'password'} />
					) : null}
				</div>
			) : null}
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
						onChange={(event) => {
							handleValue(event);
							getData(event.target.name, event.target.value);
						}}
						onBlur={handleValueTouched}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.passwordCrossCheck && touched.passwordCrossCheck ? (
						<NoticeEmptyInputValue />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{document.getElementsByClassName('valueInputBox')[1]?.value !==
						values.passwordCrossCheck &&
					values.passwordCrossCheck !== undefined ? (
						<NoticeInvalidInputValue sort={'passwordCrossCheck'} />
					) : null}
				</div>
			) : null}
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
						onChange={(event) => {
							handleValue(event);
							handleSetRegexTest(event);
							fetchData('email', event.target.value);
							getData(event.target.name, event.target.value);
						}}
						onBlur={handleValueTouched}
					/>
					<button
						type="button"
						onClick={() => {
							handleEmailValidateCodeBoxToggle();
							handleEmailInputBoxToggle();
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
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.email && touched.email ? <NoticeEmptyInputValue /> : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{(values.email && regexTest.email) === false ? (
						<NoticeInvalidInputValue sort={'email'} />
					) : null}
					{validateCodeBoxToggle ? (
						<div>
							<input
								id="emailValidateCodeInput"
								disabled={validateCodeInputBoxToggle}
								autoFocus={true}
								ref={emailValidateCheckInputBox}
								onChange={handleValidateCodeInputCheck}
								maxLength="6"
							/>
							<button
								className="emailValidateCodeButton"
								type="button"
								onClick={() => {
									handleSetEmailValidateInputBoxToggle();
									checkValidateCode();
									handleSetCheckSubmitValidateCode();
								}}
								disabled={!validateCodeInputCheck || checkSumbitValidateCode}
							>
								Confirm
							</button>

							{validateCodeInputBoxToggle ? (
								<>
									<NoticeValidateCodeCheckResult
										props={validateCodeMatchCheck}
									/>
									<button
										type="button"
										className="emailValidateCodeButton "
										onClick={() => {
											handleEmailValidateCodeBoxToggle();
											handleEmailInputBoxToggle();
											handleSetEmailValidateInputBoxToggle();
											handleValidateCodeMatchCheck();
											handleEmailConfirm();
											handleResetValidateCodeInputCheck();
											handleSetCheckSubmitValidateCode();
										}}
									>
										Cancel
									</button>
								</>
							) : (
								<NoticeValidateCodeSent />
							)}
						</div>
					) : (
						<div>
							{/*   */}
							{/* 사용자가 값을 입력 할 때 마다 이미 DB에 등록 된 값인지 확인하여 안내문구 출력 */}
							{checkDataExists === true ? <NoticeDataExists /> : null}
						</div>
					)}
				</div>
			) : null}{' '}
		</>
	);
}
