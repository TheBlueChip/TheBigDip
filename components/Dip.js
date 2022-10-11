import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Container, Typography, Grid, Box, Button, Backdrop, Modal, Fade, Checkbox, FormControlLabel, FormControl } from "@material-ui/core";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abi from '../public/config/abi.json';
import Config from '../public/config/Config.json';

const CustomCheckbox = withStyles({
    root: {
        color: '#c5cab8',
        '&$checked': {
            color: '#fff9ad',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
    dip: {
        width: '100px',
        transition: 'all .3s ease',
        zIndex: 30,
    },
    bowl: {
        width: '200px',
        transition: 'all .3s ease',
        zIndex: 20,
    },
    section: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '60px',
        "&:first-child": {
            marginLeft: '0px',
        },
        cursor: 'pointer',
        "&:hover img:nth-child(1)": {
            zIndex: 2,
            WebkitTransform: 'scale(1.5)',
            transform: 'scale(1.5)',
        },
        "&:hover img:nth-child(2)": {
            zIndex: 1,
            WebkitTransform: 'scale(2)',
            transform: 'scale(2)',
        },
        [theme.breakpoints.down("xs")]: {
            "&:hover img:nth-child(1)": {
                zIndex: 2,
                WebkitTransform: 'scale(1)',
                transform: 'scale(1)',
            },
            "&:hover img:nth-child(2)": {
                zIndex: 1,
                WebkitTransform: 'scale(1)',
                transform: 'scale(1)',
            },
            marginLeft: '0px',
            marginBottom: '50px'
        }
    },
    title: {
        fontFamily: "BreviaBold",
        lineHeight: "30px",
        fontSize: '50px',
        fontWeight: "500",
        color: '#fff9ad',
        marginTop: '100px',
        textAlign: 'center',
        [theme.breakpoints.down("xs")]: {
            marginTop: '70px',
            fontSize: '30px',
            lineHeight: '1.3'
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: "450px",
        minHeight: '350px',
        border: '5px solid #000f47',
        boxShadow: theme.shadows[5],
        padding: "30px",
        background: "#4e6dd1",
        borderRadius: "20px",
        outline: 0,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        [theme.breakpoints.down("xs")]: {
            width: "350px",
            minHeight: '300px',
            border: '2px solid #000f47',
            padding: "20px",
        }
    },
    selectModalTitle: {
        color: '#fff9ad',
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '20px'
    },
    customLabel: {
        fontWeight: "bold",
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#001446",
    },
    chipTitle: {
        marginTop: '20px',
        fontWeight: "bold",
        fontSize: "25px",
        textTransform: 'uppercase',
        lineHeight: "1.5",
        [theme.breakpoints.down("xs")]: {
            marginTop: '0px',
        }
    },
    mainContainer: {
        display: "flex",
        justifyContent: 'center',
        marginTop: "50px",
        [theme.breakpoints.down("xs")]: {
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'center',
        }
    },
    formControl: {
        paddingLeft: '20px',
        maxHeight: '150px',
        overflow: 'auto'
    },
    bottomSection: {
        margin: '50px 0',
        borderTop: "5px solid #fff9ad"
    },
    metamaskTitle: {
        marginTop: '20px',
        fontWeight: "bold",
        fontSize: "25px",
        lineHeight: "1.5",
        color: "#fff9ad",
        [theme.breakpoints.down("xs")]: {
            fontSize: "22px",
        }
    },
    boldTitle: {
        fontWeight: "bold",
        fontSize: "22px",
        lineHeight: "1.5",
        color: "rgb(210, 159, 77)",
        [theme.breakpoints.down("xs")]: {
            fontSize: "20px",
        }
    },
    addressList: {
        fontSize: "16px",
        lineHeight: "1.5",
        color: "rgb(210, 159, 77)",
        [theme.breakpoints.down("xs")]: {
            fontSize: "14px",
        }
    },
}));

const Dip = () => {
    const classes = useStyles();
    const {
        address,
        web3
    } = useSelector(state => state.ConnectWallet);

    const [open, setOpen] = useState(false);

    const { ethers } = require("ethers");

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setCheckboxArr([])
            setDipped(false);
            setCheckList([]);
        }, 1000);
    };

    const [imgArr, setImgArr] = useState([
        {
            id: 'queso',
            url1: 'dipchip1.png',
            url2: 'quesobowl.png',
            color: '#d29f4d'
        },
        {
            id: 'guac',
            url1: 'dipchip2.png',
            url2: 'guacbowl.png',
            color: '#71cf2d'
        },
        {
            id: 'salsa',
            url1: 'dipchip3.png',
            url2: 'salsabowl.png',
            color: '#500912'
        }
    ]);

    const [checkList, setCheckList] = useState([]); // array for checked ones

    const [dipped, setDipped] = useState(false) // dipped state

    const tokenList = [{
        tokenAddress: Config.GUAC_ADDRESS,
        tokenSymbol: "WGUAC",
        tokenDecimals: 18,
        tokenImage: "https://dip.weloveguac.org/guacbowl.png"
    }, {
        tokenAddress: Config.SALSA_ADDRESS,
        tokenSymbol: "WSALSA",
        tokenDecimals: 18,
        tokenImage: "https://dip.weloveguac.org/salsabowl.png"
    }, {
        tokenAddress: Config.QUESO_ADDRESS,
        tokenSymbol: "WQUESO",
        tokenDecimals: 18,
        tokenImage: "https://dip.weloveguac.org/quesobowl.png"
    }]

    const addTokens = async (token) => {
        if (!address) {
            toast.warn(`Connect your wallet!`)
            return;
        }

        if (web3) {
            try {
                const isAdded = await web3.currentProvider.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: token.tokenAddress,
                            symbol: token.tokenSymbol,
                            decimals: token.tokenDecimals,
                            image: token.tokenImage
                        },
                    },
                });
                isAdded && toast.success('ADDED!')
            } catch (error) {
                toast.error('FAILED!')
            }
        }
    }

    const dipChip = () => {
        if (!checkList.length) {
            toast.error(`Choose at least one chip!`);
            return;
        }

        async function fetchData() {
            let provider = new ethers.providers.Web3Provider(web3.currentProvider);
            const _signer = provider.getSigner();

            const contract = new ethers.Contract(Config.CONTRACT_ADDRESS, abi, _signer)
            const battleStatus = await contract.battleStatus();
            let tokenId;
            if (selectedDip == 'guac') {
                tokenId = 0
            } else if (selectedDip == 'queso') {
                tokenId = 2
            } else {
                tokenId = 1
            }

            if (battleStatus) {
                const transaction = await contract.scoop(Array(checkList.length).fill(tokenId), checkList);
                const finishTxn = await transaction.wait();
                setDipped(true);
            } else {
                toast.error('Scoop is not available now');
            }
        }

        fetchData();
    }

    const [loading, setLoading] = useState(false);

    const tasty = () => {
        setDipped(false);
        setCheckList([]);

        setLoading(true);
        async function fetchData() {
            let provider = new ethers.providers.Web3Provider(web3.currentProvider);
            const _signer = provider.getSigner();
            const contract = new ethers.Contract("0xF4dA61152A9A5A26e9014A60fE0a49955e02ADE9", abi, _signer)

            const availableTokenIds = await contract.availableTokensOfOwner(address);
            let availableTokens = []
            availableTokenIds.map(e => {
                e != 0 && availableTokens.push({
                    id: parseInt(e),
                    name: `Chip #${parseInt(e)}`
                })
            })
            setCheckboxArr(availableTokens);
            setLoading(false);
        }

        fetchData();
    }

    const [selectedDip, setSelectedDip] = useState(); // selected dip category

    const chooseDip = (event) => {
        if (!address) {
            toast.warn(`Connect your wallet!`)
            return;
        }

        event.preventDefault();
        setSelectedDip(event.currentTarget.id);
        setOpen(true);

        async function fetchData() {
            setLoading(true);
            let provider = new ethers.providers.Web3Provider(web3.currentProvider);
            const _signer = provider.getSigner();
            const contract = new ethers.Contract("0xF4dA61152A9A5A26e9014A60fE0a49955e02ADE9", abi, _signer)

            const availableTokenIds = await contract.availableTokensOfOwner(address);
            let availableTokens = []
            availableTokenIds.map(e => {
                e != 0 && availableTokens.push({
                    id: parseInt(e),
                    name: `Chip #${parseInt(e)}`
                })
            })
            setCheckboxArr(availableTokens);
            setLoading(false);
        }

        fetchData();
    }

    const [bal, setBal] = useState([]);

    const numberWithCommas = (x) => {
        return x && Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        if (web3) {
            (async () => {
                let provider = new ethers.providers.Web3Provider(web3.currentProvider);
                const _signer = provider.getSigner();
                const guacContract = new ethers.Contract(Config.GUAC_ADDRESS, Config.GUAC_ABI, _signer);
                const guacBal = await guacContract.balanceOf(Config.CONTRACT_ADDRESS);

                const salsaContract = new ethers.Contract(Config.SALSA_ADDRESS, Config.SALSA_ABI, _signer);
                const salsaBal = await salsaContract.balanceOf(Config.CONTRACT_ADDRESS);

                const quesoContract = new ethers.Contract(Config.QUESO_ADDRESS, Config.QUESO_ABI, _signer);
                const quesoBal = await quesoContract.balanceOf(Config.CONTRACT_ADDRESS);
                setBal([parseInt(guacBal) / 10 ** 18 - (217462 - 69420), parseInt(salsaBal) / 10 ** 18 - (240337 - 69420), parseInt(quesoBal) / 10 ** 18 - (249687 - 69420)]);
            })()
        }
    }, [web3]);

    const renderSwitch = (param) => {
        switch (param) {
            case 'queso':
                return bal[2];
            case 'salsa':
                return bal[1];
            case 'guac':
                return bal[0];
            default:
                return null;
        }
    }

    const [checkboxArr, setCheckboxArr] = useState([]);

    const handleChange = e => {
        if (e.target.checked === true) {
            setCheckList([...checkList, Number(e.target.value)]);
        } else {
            const selectedAcc = checkList.filter(a => {
                if (a === Number(e.target.value)) return false;
                return true;
            });
            setCheckList([...selectedAcc]);
        }
    };

    return (
        <Container>
            <Typography className={classes.title}>CHOOSE YOUR DIP</Typography>
            <Box className={classes.mainContainer}>
                {imgArr.map((elem, index) => {
                    return <Box key={index} className={classes.section} id={elem.id} onClick={chooseDip}>
                        <img className={classes.dip} src={elem.url1}></img>
                        <img className={classes.bowl} src={elem.url2}></img>
                        <Typography className={classes.chipTitle} style={{ color: elem.color }}>{elem.id}</Typography>
                        {renderSwitch(elem.id) && (
                            <Typography className={classes.chipTitle} style={{ color: elem.color, textAlign: 'center', textTransform: 'lowercase', fontSize: '18px', fontStyle: 'italic' }}>{numberWithCommas(renderSwitch(elem.id))}/69,420 {elem.id}</Typography>
                        )}
                    </Box>
                })}
            </Box>
            <Box className={classes.bottomSection}>
                <Typography className={classes.metamaskTitle}>Add contracts to metamask</Typography>
                <Grid container>
                    <Grid item md={6}>
                        <Typography className={classes.boldTitle}>ETH</Typography>
                        <Typography className={classes.addressList}>GUAC: 0x1772114243BF9436bEFAAd63a7c4E4C75Adc80c2</Typography>
                        <Typography className={classes.addressList}>SALSA: 0x9024649Ee691AcAB13ff2FBCFaEEF24419863d81</Typography>
                        <Typography className={classes.addressList}>QUESO: 0x570bF1DEC86E9863CaDC6208d1E6e4d357109000</Typography>
                    </Grid>
                    <Grid item md={6}>
                        <Typography className={classes.boldTitle}>POLYGON</Typography>
                        {tokenList.map(elem => {
                            return <Typography key={elem.tokenAddress} className={classes.addressList}>{elem.tokenSymbol}: {elem.tokenAddress}<br></br><Button style={{ border: '1px solid rgb(210, 159, 77)', padding: '5px', fontSize: '10px', lineHeight: '1.1' }} onClick={() => addTokens(elem)}>Add Token To Metamask</Button></Typography>
                        })}
                    </Grid>
                </Grid>
            </Box>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box className={classes.paper}>
                        {!dipped ? (
                            <>
                                <Typography className={classes.selectModalTitle}>
                                    Please select each chip you would like to dip in <span style={{ textTransform: 'capitalize' }}>{selectedDip}</span>
                                </Typography>
                                {loading ? (
                                    <Typography className={classes.selectModalTitle}>
                                        Loading....
                                    </Typography>
                                ) : (
                                    checkboxArr.length ? (
                                        <FormControl component="fieldset" className={classes.formControl}>
                                            {checkboxArr.map(elem => {
                                                return <FormControlLabel
                                                    key={elem.id}
                                                    control={
                                                        <CustomCheckbox
                                                            value={elem.id}
                                                            onChange={e => handleChange(e)}
                                                            checked={
                                                                checkList.lastIndexOf(Number(elem.id)) >= 0 ? true : false
                                                            }
                                                            name={elem.name} />
                                                    }
                                                    label={elem.name} />
                                            })}
                                        </FormControl>
                                    ) : (
                                        <Typography className={classes.selectModalTitle}>
                                            You're out of chips! Come back next Taco Tuesday!
                                        </Typography>
                                    )
                                )}
                                <Box mt="20px" display='flex' justifyContent='center'>
                                    <Button variant="contained" color="primary" onClick={dipChip}>
                                        Dip it
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography className={classes.selectModalTitle}>
                                    You dipped chip #{checkList.join(', ')};
                                </Typography>
                                <Typography className={classes.selectModalTitle}>
                                    You might have more chips available to dip this session
                                </Typography>
                                <Box mt="20px" display='flex' justifyContent='center'>
                                    <Button variant="contained" color="primary" onClick={tasty}>
                                        Tasty
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default Dip;