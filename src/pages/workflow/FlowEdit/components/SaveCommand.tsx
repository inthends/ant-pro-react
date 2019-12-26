import React from "react";
import { Form } from 'antd';
import { RegisterCommand, withPropsAPI } from "gg-editor";
import { FormComponentProps } from 'antd/es/form';

interface SaveCommandProps extends FormComponentProps {
  GetData(data): void;
  propsAPI?: any;
}

class SaveCommand extends React.Component<SaveCommandProps> {
  render() {
    const { propsAPI, GetData } = this.props;
    const { save } = propsAPI;
    const config = {
      // 是否进入列队，默认为 true
      queue: true,
      // 命令是否可用
      enable(/* editor */) {
        return true;
      },
      // 命令逻辑
      execute(/* editor */) {
        // console.log(propsAPI.editor);
        const data = save(); 
        GetData(data);
      }
    };
    return <RegisterCommand name="save" config={config} />;
  }
}
// export default withPropsAPI(SaveCommand);
export default Form.create<SaveCommandProps>()(withPropsAPI(SaveCommand as any));
