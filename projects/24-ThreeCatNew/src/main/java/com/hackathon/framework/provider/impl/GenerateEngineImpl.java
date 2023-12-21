package com.hackathon.framework.provider.impl;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.hackathon.framework.utils.StrategyConfigUtil;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class GenerateEngineImpl implements GenerateEngine {

    private StrategyBean strategyBean;

    public SshUtil sshUtil = new SshUtil();

    @Override
    public Result getStrategy(String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        strategyBean = StrategyConfigUtil.getStrategy(generateType);
        return new Result(startTime,"",strategyBean);
    }

    /**
     * 前置检查环境
     * fix:2023-12-20 参数错误和逻辑错误已经修改
     * @return
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    public Result preCheckGenerationEnv() throws JSchException, IOException, InterruptedException {
        long startTime = System.nanoTime();
        // 代码逻辑待补

        // 检测环境命令
        String solcVersion = "solcjs --version";
        String truffleVersion = "truffle --version";
        String errText = "";
        String soclcVersionResult = sshUtil.executeCmd(solcVersion);
        if(!soclcVersionResult.contains("not found")) {
            errText += "solcjs is not installed";
        }
        // 这里判断的是truffleVersion读取，这里错误已经修改
        String truffleVersionResult = sshUtil.executeCmd(truffleVersion);
        if(!truffleVersionResult.contains("not found")) {
            errText +=  "truffle is not installed";
        }
        return new Result(startTime,errText,"successfully");
    }

    /**
     * 初始化目录在服务器上面
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    public Result initDirectoryForServer() throws JSchException, SftpException, IOException, InvocationTargetException, IllegalAccessException, InterruptedException {
        long startTime = System.nanoTime();
        // 创建工程名称
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String mkdirCommand = "mkdir " + strategyBean.getEnginePath();
        sshUtil.executeCmd(mkdirCommand);
        // 进入目录执行init
        sshUtil.executeCmd("cd "+strategyBean.getEnginePath());
        Result envResult = this.preCheckGenerationEnv();
        String errorMessage = "";
        // 判断是否错误可以往下走这么写，hasError要返回参数啊!
        if(envResult.getHasError().isEmpty()){
            String compileName = strategyBean.getCompile();
            sshUtil.executeCmd(compileName+" init");
            List<String> compileList = strategyBean.getDirectory();
            // 获取当前路径下的文件和文件夹
            String initPathList = sshUtil.getFolder();
            //这里result应该传输null也行，只要验证truffle init的文件
            for(String element : compileList) {
                if (!initPathList.contains(element)) {
                    errorMessage = "Failed to initialize the truffle directory";
                    return new Result(startTime,errorMessage,null);
                }
            }
        }
        // 这里如果hasError是空字符串代表成功
        return new Result(startTime,envResult.getHasError(),null);
    }


    /**
     * 初始化文件夹
     * @param generateDstDirectory 最终生成的目录位置
     * @param strategyList
     * @return
     */
    @Override
    public Result initDirectoryForLocal(String generateDstDirectory,List<String>strategyList) {
        // TODO 包含ssh在服务器上面创建目录
        long startTime = System.nanoTime();
        String errText = "";
        String successText = "";
        try {
            Path rootPath = Paths.get(generateDstDirectory);
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }
            for(String dir:strategyList){
                Path path = rootPath.resolve(dir);
                Files.createDirectories(path);
            }
            successText = "Successfully initialized project at " + rootPath;
            System.out.println(successText);
        } catch (Exception e) {
            errText = "Error initializing project: " + e.getMessage();
            System.err.println(errText);
        }
        return new Result(startTime,errText,successText);
    }

    /**
     * 加载合约
     * @return
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    @Override
    public Result loadContract() throws JSchException, IOException, InterruptedException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        // mv操作应是在truffle初始化的目录下进行
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");;
        String mvContractCommand = "mv /root/Hackathon-2023-winter/contract/* " + strategyBean.getEnginePath() + "/contracts/";
        String errorMessage = sshUtil.executeCmd(mvContractCommand);
        return new Result(startTime,errorMessage,"");
    }

    /**
     * 获取合约ABI
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    @Override
    public Result compilationContract() throws IOException, InvocationTargetException, IllegalAccessException, JSchException, InterruptedException {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        // 获取工程路径
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String abi = null;
        String errorMessage = null;

        // 拷贝模板truffle-config.js
        String cpTemplateConfigurationFile = "cp -f /root/truffle-config.js " + strategyBean.getEnginePath() + "/truffle-config.js";
        errorMessage += sshUtil.executeCmd(cpTemplateConfigurationFile);

        String cdPathCommand = "cd " + strategyBean.getEnginePath();
        errorMessage += sshUtil.executeCmd(cdPathCommand);
        // 编译合约
        String compileContractCommand = "truffle compile";
        errorMessage += sshUtil.executeCmd(compileContractCommand);

        // 查看合约abi，两个合约采用\n分隔
        String catContractEtherStoreAbiCommand = "cat " + strategyBean.getEnginePath() + "/build/contracts/" + "EtherStore.json\n";
        abi += sshUtil.executeCmd(catContractEtherStoreAbiCommand);
        String catContractAbiCommand = "cat " + strategyBean.getEnginePath() + "/build/contracts/" + "Attack.json";
        abi += sshUtil.executeCmd(catContractAbiCommand);
        if (errorMessage.isEmpty()) {
            return new Result(startTime,errorMessage, abi);
        }

        return new Result(startTime,errorMessage,"");
    }

    @Override
    public Result afterCheckGenerationDirectory() {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        return new Result(startTime,"","");
    }
}
