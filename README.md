<h2>Motivation</h2>
Experiment with symetric encryption i.e. same key used to ebcrypt and decrypt. This may be used to encrypt coupon data in query string

<h2>Points of interest</h2>
<ul>
<li>make sure the result is valid as query string in url - i am using isSafeForURL inside encryptAndEncodeObject</li>
<li>make sure the result is not to long - according to chatgpt the encrypted string len for Symmetric Encryption is about the same as the original string length</li>
<li>make sure that encryption does not take too long - the test go very fast 289ms all four tests</li>
</ul>
