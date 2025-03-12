import './InputAddressModal.less';
import { Modal, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

const InputAddressModal: React.FC = (props: any) => {
  const { visible, onCancel, onOk, address, activeChain } = props;
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [disabled, setDisabled] = useState(true);

  const handleOk = async () => {
    if (disabled) return;
    const values = await form.validateFields();
    onOk(values.address);
  };

  const handleInputChange = (e: any) => {
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
    const evmAddressReg = /^0x[0-9a-fA-F]{40}$/;
    if (activeChain.toLowerCase() === 'solana') {
      if (solanaAddressRegex.test(e.target.value)) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      if (evmAddressReg.test(e.target.value)) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ address });
      if (address) {
        setDisabled(false);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus({ cursor: 'end' });
  }, [inputRef]);

  const handleCancel = () => {
    if (address) {
      onOk(address);
    } else {
      onCancel();
    }
  };
  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      visible={visible}
      footer={null}
      style={{ top: 'calc(50vh - 200px)' }}
      width="450px"
      className="select-modal"
      onCancel={handleCancel}
      title="The Recipient’s Address"
    >
      <div className="modal-list">
        <Form form={form}>
          <Form.Item
            name="address"
            // rules={[{
            //     pattern: /^0x[0-9a-fA-F]{40}$/, message: 'Invalid address'
            // }]}
            rules={[
              {
                validator: (rule: any, value: any, callback: any) => {
                  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{44}$/;
                  const evmAddressReg = /^0x[0-9a-fA-F]{40}$/;
                  if (activeChain.toLowerCase() === 'solana') {
                    if (solanaAddressRegex.test(value)) {
                      callback();
                    } else {
                      callback('Invalid address');
                    }
                  } else {
                    if (evmAddressReg.test(value)) {
                      callback();
                    } else {
                      callback('Invalid address');
                    }
                  }
                },
              },
            ]}
          >
            <Input
              autoFocus
              ref={inputRef}
              onChange={handleInputChange}
              className="input-address"
              placeholder="0x"
            />
          </Form.Item>
          <div>
            <div
              className={` text-center ${!disabled ? 'confirm-button bg-gray-600' : 'confirm-button-disabled bg-gray-400'} text-white font-normal text-sm rounded-2xl`}
              style={{ cursor: !disabled ? 'pointer' : 'not-allowed' }}
              onClick={handleOk}
            >
              Confrim
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default InputAddressModal;
