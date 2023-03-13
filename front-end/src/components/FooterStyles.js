import styled from 'styled-components';

export const Box = styled.div`
padding: 20px 10px 0;
background: #350f4f;
bottom: 0;
width: 100%;


@media (max-width: 1000px) {
	padding: 70px 30px;
	width: 100%;
}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 1000px;
	background: #350f4f;
	margin: 0 auto;
	/* background: red; */
`

export const Column = styled.div`
display: flex;
flex-direction: column;
text-align: left;
margin-left: 60px;
border-right: 2px solid white;
`;

export const Row = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill,
						minmax(185px, 1fr));
grid-gap: 10px;
margin-bottom: 20px;
@media (max-width: 1000px) {
	grid-template-columns: repeat(auto-fill,
						minmax(200px, 1fr));
}
`;

export const FooterLink = styled.a`
color: #fff;
margin-bottom: 20px;
font-size: 18px;
text-decoration: none;
&:hover {
	color: blue;
	transition: 200ms ease-in;
}
`;

export const Copyright = styled.p`
color: #fff;
margin-bottom: 10px;
font-size: 10px;
text-decoration: none;
`;