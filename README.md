<h2>Motivation</h2>
Experiment with symetric encryption i.e. same key used to ebcrypt and decrypt. This may be used to encrypt coupon data in query string

<h2>Encrypt query string consideration</h2>
<ul>
<li>using encryption as is in query string is not a good practice because encryption might crerate string with illegal charachters for url. To solve this i am using encodeURIComponent in the encryption side and decodeURIComponent in the decryption side</li>
<li>encryption might create long string , so be caution not to violate browser url length limitation. the following is from chatgpt "However, it's a common understanding that many modern browsers, including Chrome, can generally handle URLs of several thousand characters. For practical purposes, URLs that are reasonably short (a few hundred characters or less) are less likely to cause issues across different platforms, servers, and proxy configurations."</li>
</ul>


<h2>test points of interest</h2>
<ul>
<li>make sure the result is valid as query string in url - i am using test with isSafeForURL</li>
<li>make sure the result is not to long - according to chatgpt the encrypted string len for Symmetric Encryption is about the same as the original string length</li>
<li>make sure that encryption does not take too long - the test go very fast 289ms all four tests</li>
</ul>

<h2>References</h2>
ChatGpt