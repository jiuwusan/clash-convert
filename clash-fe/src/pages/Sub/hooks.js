import { useEffect, useState } from 'react'
import API from '../../api'
import { message } from '../../component';

const { convertApi } = API

export const useRules = (props) => {
    const { value, onChange } = props;
    const [rules, setRules] = useState([]);

    const getRules = async () => {
        let rs = await convertApi.rules();
        if (rs.code === 0)
            setRules(rs.data)
    }

    const onItemChange = (event, index) => {
        let value = event.target.value;
        let newRules = [...rules];
        newRules[index].checked = value;
        setRules(newRules);
    }

    useEffect(() => {
        onChange && onChange(rules)
    }, [rules])

    useEffect(() => {
        getRules();
    }, [])

    return [value || [], onItemChange]
}


export const useShortLink = (props) => {
    const [shortLink, setShortLink] = useState([]);

    const submit = async (value) => {
        message.loading('正在生成');
        let rs = await convertApi.link(value);
        message.destroy()
        if (rs.code === 0) {
            setShortLink(rs.data.rss)
            message.success('订阅链接已生成，点击复制');
        } else {
            message.error(rs.msg);
        }
    }

    const onCopy = () => {
        navigator.clipboard.writeText(shortLink).then(() => {
            message.success('复制成功');
        })
    }

    return [shortLink, submit, onCopy]
}

export const useServerLink = (props) => {
    const { value, onChange } = props;
    const [url, setURL] = useState('');

    useEffect(() => {
        let hostname = document.location.host;
        let protocol = document.location.protocol;
        setURL(`${protocol}//${hostname}/sub-api`)
    }, [])

    useEffect(() => {
        (value != url) && onChange && onChange(url);
    }, [url])

    useEffect(() => {
        (value != url) && onChange && onChange(url);
    }, [value])

    return [url]
}