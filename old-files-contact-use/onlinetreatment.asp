<%@ LANGUAGE = PerlScript %>
<%
$requestMethod = $Request->ServerVariables('REQUEST_METHOD')->Item;
return if $requestMethod ne 'POST';

$name			 = &f_getClientVariable('name', 'Not Provided');
$email			 = &f_getClientVariable('email', 'Not Provided');
$mailing_address = &f_getClientVariable('mailing_address', 'Not Provided');
$city			 = &f_getClientVariable('city', 'Not Provided');
$state			 = &f_getClientVariable('state','Not Provided');
$country		 = &f_getClientVariable('country','Not Provided');
$zip		     = &f_getClientVariable('zip','Not Provided');
$dob			 = &f_getClientVariable('country','Not Provided');
$home_phone		 = &f_getClientVariable('home_phone','Not Provided');
$mobile_number	 = &f_getClientVariable('mobile_number','Not Provide');
$problem		 = &f_getClientVariable('problem','Not Provided');

&f_send();
$thanks = <<TX1;
<img src="images/t_online.gif" align=right><br><br>
<p> <font color=#FF0000 face=arial size=2> Your details have been sent successfully. We will come back to you as soon as possible.<br>
Thank you.</font>

TX1
$title        = "Unanidoctors - Online treatment." ;
$content = &f_readFile($Server->MapPath("template.html"));
$content =~ s/<!--REPLACE.BODY-->/$thanks/;
$content =~ s/<!--REPLACE.TITLE-->/$title/;
$Response->write($content);

sub f_send {
   my $body = <<BODY11;
The following message is received from your website: http://unanidoctors.com/online-treatment.html
Name : $name 
eMail : $email 
Address : $mailing_address 
City : $city 
State : $state 
Country : $country 
ZIP : $zip 
Age & Sex : $dob 
Home Pone : $home_phone 
Mobile : $mobile_number	
Problem : $problem 
### end of message ###
BODY11
# drasad\@unanidoctors.com
&f_sendEmail( "Website Visitor", "mayor\@HamaraShehar.com", "drasad\@unanidoctors.com", "Message from your website visitor - Online Treatment", $body );
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
   use Mail::Sender;
my $sender = new Mail::Sender {from => $fromEmail,smtp => 'm15.hs9.in',
'auth' => 'PLAIN', authid => 'do.not.reply@HamaraShehar.com',authpwd =>
'D0.N0t.Reply'};
$sender->OpenMultipart({to=> $toEmail, subject=> $subject});
$sender->Body();
$sender->Send($body);
$sender->Close();
return 1;

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
