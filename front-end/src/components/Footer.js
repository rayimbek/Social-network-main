import React from "react";
import {
Box,
Container,
Row,
Column,
FooterLink,
Copyright
} from "./FooterStyles";

const Footer = () => {
return (
	<Box style={{width:'100%'}}>
	<Container>
		<Row>
		<Column>
			<FooterLink href="#">Home</FooterLink>
		</Column>
		<Column>
			<FooterLink href="#">About us</FooterLink>
		</Column>
		<Column>
			<FooterLink href="#">Contact us</FooterLink>
		</Column>
        <Column>
            <FooterLink href="#">log in</FooterLink>
        </Column>
		<Column>
            <FooterLink href="#">Register</FooterLink>
		</Column>
		{/* <Column>
			<Heading>Social Media</Heading>
			<FooterLink href="#">
			<i className="fab fa-facebook-f">
				<span style={{ marginLeft: "10px" }}>
				Facebook
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-instagram">
				<span style={{ marginLeft: "10px" }}>
				Instagram
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-twitter">
				<span style={{ marginLeft: "10px" }}>
				Twitter
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-youtube">
				<span style={{ marginLeft: "10px" }}>
				Youtube
				</span>
			</i>
			</FooterLink>
		</Column> */}
		</Row>
			<Copyright>
			Copyright C 2022 Nigma Galaxy
			</Copyright>
	</Container>
	</Box>
);
};
export default Footer;
