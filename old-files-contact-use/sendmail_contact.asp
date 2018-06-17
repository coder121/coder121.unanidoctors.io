<%@ LANGUAGE = PerlScript %>
<%
$requestMethod = $Request->ServerVariables('REQUEST_METHOD')->Item;
return if $requestMethod ne 'POST';

$user_to  = &f_getClientVariable('user_to', 'Not Provided');
$email    = &f_getClientVariable('email', 'Not Provided');
$subject  = &f_getClientVariable('subject', 'Not Provided');
$message  = &f_getClientVariable('message', 'Not Provided');

&f_sendEmail( "Website Visitor", "$email", "drasad\@unanidoctors.com", "$subject", "$message" );
my $confirmation = qq[<p><b>Your message has been sent successfully.</b>];
$content = &f_readFile($Server->MapPath("email.asp.50.html"));
$content =~ s/<!--message-->/$confirmation/;
$Response->write($content);

sub f_readFile {
  local( $fileName ) = shift;
  local( $tempContent );
  open( FL2, "<$fileName" );
  @tempContent  = <FL2>;
  close( FL2 );
  return ( join( '', @tempContent ) );
}

sub f_getClientVariable {
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
} ##f_getClientVariable

sub f_sendEmail {
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
%>
