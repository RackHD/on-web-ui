# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.define :server do |server|
    server.vm.box = "ubuntu/trusty64"
    server.vm.box_url = "https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/14.04/providers/virtualbox.box"

    server.vm.network :forwarded_port, guest: 5000, host: 4444
    server.vm.network :private_network, ip: "192.168.33.10"
    server.vm.network :public_network
    server.ssh.forward_agent = true

    # server.vm.synced_folder ".", "/vagrant"

    server.vm.provider :virtualbox do |vb|
      vb.name = "on-web-ui"
      vb.gui = true
      vb.memory = "1024"
      vb.cpus = 1
    end

    server.vm.provision :file, source: "provision.sh", destination: "/tmp/provision.sh"

    vars = "";
    vars += "VAGRANT_PROVISION=1 "
    vars += "VERBOSE_PROVISION=1 "
    vars += "RUN_ON_WEB_UI=1 "
    server.vm.provision :shell, inline: "sudo " + vars + " /tmp/provision.sh"
  end

  config.vm.define :test do |test|
    test.vm.box = "ubuntu/trusty64"
    test.vm.box_url = "https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/14.04/providers/virtualbox.box"

    test.vm.network :private_network, ip: "192.168.33.10"
    test.vm.network :public_network
    test.ssh.forward_agent = true

    # server.vm.synced_folder ".", "/vagrant"

    test.vm.provider :virtualbox do |vb|
      vb.name = "on-web-ui"
      vb.gui = true
      vb.memory = "1024"
      vb.cpus = 1
    end

    test.vm.provision :file, source: "provision.sh", destination: "/tmp/provision.sh"

    vars = "";
    vars += "VAGRANT_PROVISION=1 "
    vars += "VERBOSE_PROVISION=1 "
    vars += "TEST_ON_WEB_UI=1 "
    test.vm.provision :shell, inline: "sudo " + vars + " /tmp/provision.sh"
  end

  ## COREOS
  config.vm.define :docker do |docker|
    docker.vm.box = "yungsang/coreos"
    docker.vm.box_url = "https://atlas.hashicorp.com/yungsang/boxes/coreos/versions/1.3.8/providers/virtualbox.box"

    docker.vm.network :forwarded_port, guest: 2375, host: 2375
    docker.vm.network :private_network, ip: "192.168.33.10"
    docker.vm.network :public_network
    docker.ssh.forward_agent = true

    docker.vm.synced_folder ".", "/vagrant"

    docker.vm.provider :virtualbox do |vb|
      vb.name = "on-web-ui-docker"
      vb.gui = true
      vb.memory = "1024"
      vb.cpus = 1
      # vb.auto_nat_dns_proxy = false
      # vb.customize ["modifyvm", :id, "--natdnsproxy1", "off" ]
      # vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off" ]
    end

    docker.vm.provision :file, source: "provision.sh", destination: "/tmp/provision.sh"

    vars = "";
    vars += "VAGRANT_PROVISION=1 "
    vars += "VERBOSE_PROVISION=1 "
    vars += "DOCKER_PROVISION=1"
    docker.vm.provision :shell, inline: "sudo " + vars + " /tmp/provision.sh"
  end

  # config.vm.provision :shell, inline: <<-SHELL
  #   sudo apt-get update
  #   sudo apt-get install -y apache2
  # SHELL
end
