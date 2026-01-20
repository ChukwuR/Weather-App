import '../style/footer.css'
import { Link } from 'react-router-dom'

function FooterComponents(){

    return(
        <>
            <div className='footer-container'>
                <div className='footer-body'>
                    <div className='site-name'>
                        <h2>LUME Weather</h2>
                        <span>Lorem ipsum dolor sit amet.</span>
                    </div>

                    <div className='site-info'>
                        <div className='aboutSection'>
                            <p>About</p>
                            <li>Research</li>
                        </div>
                        <div className='menuSection'>
                            <p>Menu</p>
                            <li><Link to='/' className='footerLinkTxt'>Home</Link></li>
                            <li><Link to='/profile' className='footerLinkTxt'>Profile</Link></li>
                        </div>
                        <div className='serviceSection'>
                            <p>Service</p>
                            <li>Weather Forecast</li>
                        </div>
                        <div className='contactSection'>
                            {/* <p>Contact</p> */}
                            <div className='contact-body'>
                                <span style={{fontWeight:'bold'}}>Call:</span>
                                <br />
                                <span>+23480770820</span>
                            </div>
                            <div className='contact-body'>
                                <span style={{fontWeight:'bold'}}>Email:</span>
                                <br />
                                <span>orjir207@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    <div className='site-location'>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253630.69731739286!2d3.3943761530520504!3d6.649444344418458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bee62d44ab573%3A0x44ddf6ea18edfcb3!2sIkorodu%2C%20Lagos!5e0!3m2!1sen!2sng!4v1768337475024!5m2!1sen!2sng" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <div className='icon-container'>
                    <div>
                        <span>
                            <i class="bi bi-facebook"></i>
                        </span>
                    </div>
                    <div>
                        <span>
                            <i class="bi bi-instagram"></i>
                        </span>
                    </div>
                    <div>
                        <span>
                            <i class="bi bi-twitter-x"></i>
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FooterComponents;