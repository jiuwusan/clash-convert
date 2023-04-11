import './index.css';
import { useRules, useShortLink, useServerLink } from './hooks';
import { Form, Input, Select, Radio, Button, Space } from '../../component';

const { TextArea } = Input;

const RuleItem = (props) => {
    const { data: { proxies = [], name }, ...rest } = props;
    let proxiesOption = proxies.map((item, index) => ({ label: item, value: index }))
    return <div className='sub-radio-item'>
        <div className='sub-radio-group'>
            <div className='sub-radio-label'>{name}</div>
            <Radio.Group {...rest} options={proxiesOption} optionType="button" buttonStyle="solid" size='small' />
        </div>
    </div>
}

const Rules = (props) => {
    const [rules, onItemChange] = useRules(props);

    return <div className='sub-radio-list'>
        {rules.map((item, index) => <RuleItem key={item.name} data={item} value={item.checked} onChange={(event) => onItemChange(event, index)}></RuleItem>)}
    </div>
}

const ServerInput = (props) => {
    const [value, onChange] = useServerLink(props);
    return <Input value={value} onChange={onChange} />
}

const Sub = () => {
    const [shorLink, formSubmit, onCopy] = useShortLink();

    return <div className='sub-box'>
        <Form labelCol={{ span: 4 }} layout="horizontal" onFinish={formSubmit}>
            <Form.Item label="订阅链接" name='urls' rules={[{ required: true }]}>
                <TextArea placeholder='注意 ；每行只能一个链接' autoSize />
            </Form.Item>
            <Form.Item label="重命名" name='rename'>
                <Input />
            </Form.Item>
            <Form.Item label="后端地址" name='baseApi' rules={[{ required: true }]}>
                <ServerInput />
            </Form.Item>
            <Form.Item label="客户端" name='client' initialValue="Clash">
                <Select options={[{ value: 'Clash', label: 'Clash' }]}></Select>
            </Form.Item>
            <Form.Item label="首选项" name='proxyGroups'>
                <Rules />
            </Form.Item>
            <Form.Item label="自定义规则" name='cusRules'>
                <TextArea placeholder='注意 ；每行只能一个规则' autoSize />
            </Form.Item>
            <Form.Item label="短链接">
                <Space.Compact style={{ width: '100%' }}>
                    <Input value={shorLink} />
                    <Button type="primary" onClick={onCopy}>复制</Button>
                </Space.Compact>
            </Form.Item>
            <Space.Compact className='sub-from-button'>
                <Form.Item name='uid'>
                    <Input placeholder='UID' style={{ width: '120px' }} />
                </Form.Item>
                <Form.Item name='secret'>
                    <Input placeholder='Secret' style={{ width: '120px' }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" className='sub-from-submit'>生成订阅链接</Button>
            </Space.Compact>
        </Form>
    </div>
}

export default Sub