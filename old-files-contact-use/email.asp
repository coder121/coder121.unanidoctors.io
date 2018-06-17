<%@ LANGUAGE = PerlScript %>
<%
$requestMethod = $Request->ServerVariables('REQUEST_METHOD')->Item;
return if $requestMethod ne 'POST';

$user_to		 = &f_getClientVariable('user_to', '');
$email			 = &f_getClientVariable('email', 'mayor@HamaraShehar.com');
$subject		 = &f_getClientVariable('subject', 'Not Provided');
$message		 = &f_getClientVariable('message', 'Not Provided');

&f_send();
$thanks = <<TX1;
<br><br>
<p> <font color=#FF0000 face=arial size=2> eMail has been sent successfully.<br>
Thank you.</font>

TX1
$title        = "Unanidoctors - Send eMail." ;
$content = &f_readFile($Server->MapPath("template.html"));
$content =~ s/<!--REPLACE.BODY-->/$thanks/;
$content =~ s/<!--REPLACE.TITLE-->/$title/;
$Response->write($content);

sub f_send {
   my $body = <<BODY11;
The following message is received from your website: http://unanidoctors.com/contact.html
Message : $message <br>
### end of message ###
BODY11
# drasad\@unanidoctors.com
&f_sendEmail( "Website Visitor", $email, "drasad\@unanidoctors.com", "Message from your website visitor", $body );
#$Response->write($body);
}

sub f_readFile {
  local( $fileName ) = shift;
  local( $tempContent );
  open( FL2, "<$fileName" );
  @tempContent  = <FL2>;
  close( FL2 );
  return ( join( '', @tempContent ) );
}

sub f_getClientVariable	 {
   my $var1     = shift;
   my $default1 = shift;
   my $temp1    = '';

   if ( $var1 eq null ) {
	  return 'null';
   }
   if ( defined($Request->Form($var1)->Item) ) {
      $temp1 = $Request->Form($var1)->Item;
   }
   if ( $temp1 ne '' ) {
      return $temp1;
   }
   elsif ( defined($default1)) {
   	  return $default1;
   }
   return 'null';
}	##f_getClientVariable

sub f_sendEmail1 {
   my $fromWhom  = shift;
   my $fromEmail = shift;
   my $toEmail   = shift;
   my $subject   = shift;
   my $body      = shift;

   my $Mailer = $Server->CreateObject("SMTPsvg.Mailer");
   $fromWhom  = 'From HamaraShehar' if ($fromWhom eq '');
   $fromEmail = 'mayor@hamarashehar.com' if ($fromEmail eq '');

$objMail = $Server->CreateObject("CDONTS.Newmail");
$objMail->{'To'} = $toEmail;
$objMail->{'Subject'} = $subject;
$objMail->{'From'} = $fromEmail;
$objMail->{'Body'} = $body;
$rc = $objMail->send();
undef $objMail;
return 1;
}

sub f_sendEmail {
   my $fromWhom  = shift;
   my $fromEmail = shift;
   my $toEmail   = shift;
   my $subject   = shift;
   my $body      = shift;
   $fromWhom  = 'From HamaraShehar' if ($fromWhom eq '');
   $fromEmail = 'mayor@hamarashehar.com' if ($fromEmail eq '');

   $objMail = $Server->CreateObject("CDO.Message");
   $objMail->{'To'} = $toEmail;
   $objMail->{'Subject'} = $subject;
   $objMail->{'From'} = $fromEmail;
   $objMail->{'TextBody'} = $body;
   $rc = $objMail->send();
   undef $objMail;
   return 1;
}
%>
